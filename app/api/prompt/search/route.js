import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, res) => {
  const { searchText } = await req.json();

  try {
    await connectToDB();
    const res = await Prompt.find({ tag: searchText });
    if (!res) {
      return Response.json("No prompt is found.");
    }

    const data = await res.json();
    return Response.json({ data });
  } catch (error) {
    return new Response("An error occured");
  }
};

export async function GET() {
  const data = await Prompt.find({ tag: "/" + searchText + "/i" });
  if (!data) {
    return Response.json("No prompt is found.");
  }

  return Response.json({ data });
}
