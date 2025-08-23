import dbConnect from "@/config/connectDB";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();

        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 400,
                }
            );
        }

        if (user.isVerified) {
            return Response.json(
                {
                    success: false,
                    message: "User already verified",
                },
                {
                    status: 400,
                }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (!isCodeValid) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification code",
                },
                {
                    status: 400,
                }
            );
        }

        if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired please signup again to get new code",
                },
                {
                    status: 400,
                }
            );
        }

        await UserModel.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    isVerified: true,
                },
                $unset: {
                    verifyCode: 1,
                    verifyCodeExpiry: 1,
                }
            }
        )

        return Response.json(
            {
                success: true,
                message: "Account verified successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error in verifying User: ", error);
        return Response.json(
            {
                success: false,
                message: "Error in verifying User",
            },
            {
                status: 500,
            }
        );
    }
}
