import { message } from "@fssstack/mdkit-core";
import type { TRPCInstance } from "@fssstack/mdkit-server";
import { z } from "zod";

export const helloWorld = (t: TRPCInstance) =>
  t.procedure
    .input(z.object({ name: z.string().optional() }).optional())
    .query(() => {
      return { message };
    });
