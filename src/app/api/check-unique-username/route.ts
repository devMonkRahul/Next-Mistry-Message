import dbConnect from "@/config/connectDB";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username"),
        };

        // Validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            const errorTree = z.treeifyError(result.error);
            const usernameErrors = errorTree.properties?.username?.errors || [];

            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(", ")
                            : "Invalid query parameters",
                },
                {
                    status: 400,
                }
            );
        }

        const { username } = result.data;

        const user = await UserModel.findOne({ username, isVerified: true });
        if (user) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                {
                    status: 400,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Username is available",
            },
            {
                status: 200,
            }
        )
    } catch (error) {
        console.log("Error checking username: ", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username",
            },
            {
                status: 500,
            }
        );
    }
}
