import { Box, FormControl, Input, InputLabel, Button } from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { type FormData } from "../types/Form";
import { formValidationSchema } from "../schema";

export default function Form({ mode }: { mode?: "Test" }) {
  const {
    handleSubmit,
    register,
    reset,
    setError,
    formState: { errors, isSubmitSuccessful, isSubmitting, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(formValidationSchema),
  });

  const httpQuery = async (payload: FormData) => {
    try {
      const request = await axios.post<FormData>(
        "https://68a8502fbb882f2aa6de2b38.mockapi.io/form",
        JSON.stringify(payload),
        {
          headers: {
            "Content-Type": "Application/json",
          },
        }
      );
      return request.data;
    } catch (error) {
      setError("root", { message: "Échec de la soumission du formulaire." });
    }
  };

  const onFormSubmit: SubmitHandler<FormData> = async (payload) => {
    return httpQuery(payload);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      toast.success("Le formulaire a été soumis avec succès.");
      reset(); // reset form after succesfull submission
    }
  }, [isSubmitSuccessful]);

  useEffect(() => {
    if (errors.root?.message) {
      toast.error(errors.root.message);
    }
  }, [errors.root]);

  return (
    <Box
      component={"form"}
      sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      onSubmit={handleSubmit(onFormSubmit)}
      data-testid={"form-test"}
    >
      <FormControl>
        <InputLabel htmlFor={"firstName"}>Nom</InputLabel>
        <Input id="firstName" {...register("firstName")} type="text" required />
        {errors.firstName && (
          <p style={{ color: "red" }}>{errors.firstName.message}</p>
        )}
      </FormControl>
      <FormControl>
        <InputLabel htmlFor={"lastName"}>Prénom</InputLabel>
        <Input id="lastName" {...register("lastName")} type="text" required />
        {errors.lastName && (
          <p style={{ color: "red" }}>{errors.lastName.message}</p>
        )}
      </FormControl>
      <FormControl>
        <InputLabel htmlFor={"email"}>Email</InputLabel>
        <Input id="email" {...register("email")} type="email" required />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
      </FormControl>
      <FormControl>
        <InputLabel htmlFor={"password"}>Mot du passe</InputLabel>
        <Input
          id="password"
          {...register("password")}
          type="password"
          required
        />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}
      </FormControl>
      <FormControl>
        <Button
          type={"submit"}
          disabled={isSubmitting}
          variant="outlined"
          sx={{ width: "20%" }}
          data-testid={"test-submit"}
        >
          Valider
        </Button>
      </FormControl>
      <ToastContainer draggable={true} autoClose={3000} />
      {mode === "Test" &&
        (errors.firstName ||
          errors.lastName ||
          errors.password ||
          errors.email) && <div>validation error</div>}
      {mode === "Test" && errors.root?.message && (
        <div>Échec de la soumission du formulaire.</div>
      )}
    </Box>
  );
}
