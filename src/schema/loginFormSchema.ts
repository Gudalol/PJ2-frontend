"use client"

import { z } from "zod"

const formSchemaLogin = z.object({
  matricula: z.string().max(12),
  password: z.string(),
})
  .refine((data) => {
    return data.matricula.length > 0 && data.password.length > 0
  }, {
    message: "Preencha todos os campos",
  });

