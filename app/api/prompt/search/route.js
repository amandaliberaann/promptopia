import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

// export const GET = async (req, res) => {
//   const { searchText } = await req.json();

//   try {
//     await connectToDB();
//     const res = await Prompt.find({ tag: searchText });
//     if (!res) {
//       return Response.json("No prompt is found.");
//     }

//     const data = await res.json();
//     return new Response(JSON.stringify(data), { status: 200 });
//   } catch (error) { s
//     return new Response("An error occured.", { status: 500 });
//   }
// };

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const tagData = searchParams.get("tagData");

    const data = await Prompt.find({ tag: tagData }).populate("creator");
    if (!data) {
      return new Response("There is no prompt under this tag", { status: 404 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("An error occured.", { status: 500 });
  }
}
