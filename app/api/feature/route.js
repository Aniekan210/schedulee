import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_PAGE_ID;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, feature } = body;

    if (!email || !feature) {
      return NextResponse.json(
        { error: "Email and feature are required" },
        { status: 400 }
      );
    }

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Request: {
          title: [{ text: { content: feature } }],
        },
        "Added to Roadmap": {
          select: { name: "Not Added" },
        },
        Priority: {
          select: { name: "Low" },
        },
        Notes: {
          rich_text: [],
        },
        Source: {
          rich_text: [{ text: { content: email } }],
        },
      },
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add feature request" },
      { status: 500 }
    );
  }
}
