import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const PATCH = async (req, { params }) => {
  const { prompt, tag } = await req.json();
  try {
    await connectToDB();
    const doc = await Prompt.findById(params.id);

    doc.prompt = prompt;
    doc.tag = tag;
    await doc.save();
    return new Response(JSON.stringify(doc), {
      status: 200,
    });
  } catch (error) {
    return new Response("Prompts not found", {
      status: 404,
    });
  }
};
