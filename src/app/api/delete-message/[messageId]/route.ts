import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/config/connectDB";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            {
                status: 401,
            }
        );
    }
    
    const { messageId } = await params;

    try {
        await UserModel.findByIdAndUpdate(
            user._id,
            {
                $pull: {
                    messages: {
                        _id: messageId,
                    }
                }
            }
        )
        return Response.json(
            {
                success: true,
                message: "Message deleted successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error in deleting message: ", error);
        return Response.json(
            {
                success: false,
                message: "Error in deleting message",
            },
            {
                status: 500,
            }
        );
    };
}