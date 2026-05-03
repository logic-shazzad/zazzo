import { NextResponse } from "next/server";
import { isStoreUnavailableError } from "@/lib/store";

export function jsonError(error: unknown, fallbackMessage: string) {
  const message = error instanceof Error ? error.message : fallbackMessage;
  const status = isStoreUnavailableError(error) ? 503 : 400;

  return NextResponse.json({ message }, { status });
}
