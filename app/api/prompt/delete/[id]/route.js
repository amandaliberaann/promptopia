import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    await Prompt.findByIdAndDelete(params.id);

    return new Response("Successfully delete the prompt!", {
      status: 200,
    });
  } catch (error) {
    return new Response("Fail to delete prompt", {
      status: 500,
    });
  }
};
