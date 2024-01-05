import { connectToDB } from "@utils/database";
import User from "@models/user";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const user = await User.findById(params.id);

    if (!user) return new Response("User Not Found", { status: 404 });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch this prompt", {
      status: 500,
    });
  }
};
