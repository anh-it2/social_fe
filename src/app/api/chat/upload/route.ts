import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { API_BASE_URL } from "@/shared/lib/apiBaseUrl";
import {
  tokenOf,
  unauthorized,
  type Envelope,
} from "@/shared/lib/beProxy";

interface UploadDTO {
  fileUrl: string;
}

export async function POST(req: NextRequest) {
  const token = tokenOf(req);
  if (!token) return unauthorized();

  const input = await req.formData().catch(() => null);
  const file = input?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "No image selected" },
      { status: 400 },
    );
  }

  const output = new FormData();
  output.append("file", file, file.name);
  output.append("uploadType", "CHAT_IMAGE");

  try {
    const backendResponse = await axios.post<Envelope<UploadDTO>>(
      `${API_BASE_URL}/uploads/single`,
      output,
      { headers: { authorization: `Bearer ${token}` } },
    );
    const body = backendResponse.data;
    const url = body.data?.fileUrl;

    if (!body.success || !url) {
      return NextResponse.json(
        { message: body.message || "Image upload failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const body = error.response.data as Envelope<unknown> | undefined;
      return NextResponse.json(
        { message: body?.message || "Image upload failed" },
        { status: error.response.status },
      );
    }

    return NextResponse.json(
      { message: "Cannot reach upload server" },
      { status: 502 },
    );
  }
}
