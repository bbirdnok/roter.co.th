import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import { createLead, getLeads, getLeadById, updateLeadStatus } from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Lead management
  leads: router({
    // Public endpoint to submit lead form
    submit: publicProcedure
      .input(
        z.object({
          organizationType: z.string().min(1),
          organizationName: z.string().min(1),
          organizationSize: z.string().min(1),
          fullName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          serviceInterest: z.string().optional(), // JSON array
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await createLead({
            organizationType: input.organizationType,
            organizationName: input.organizationName,
            organizationSize: input.organizationSize,
            fullName: input.fullName,
            email: input.email,
            phone: input.phone || null,
            serviceInterest: input.serviceInterest || null,
            message: input.message || null,
            status: "new",
          });

          // Notify owner about new lead
          await notifyOwner({
            title: "🎯 New Lead Submission",
            content: `${input.fullName} from ${input.organizationName} (${input.organizationType}) has submitted a lead form.\n\nEmail: ${input.email}\nPhone: ${input.phone || "N/A"}\n\nMessage: ${input.message || "No message provided"}`,
          });

          return { success: true, message: "Lead submitted successfully" };
        } catch (error) {
          console.error("[API] Failed to submit lead:", error);
          throw new Error("Failed to submit lead form");
        }
      }),

    // Admin endpoint to view all leads
    list: adminProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getLeads(input.limit, input.offset);
      }),

    // Admin endpoint to get single lead
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getLeadById(input.id);
      }),

    // Admin endpoint to update lead status
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["new", "contacted", "qualified", "rejected"]),
        })
      )
      .mutation(async ({ input }) => {
        return await updateLeadStatus(input.id, input.status);
      }),
  }),
});

export type AppRouter = typeof appRouter;
