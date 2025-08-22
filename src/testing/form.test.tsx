import Form from "../components/Form.tsx";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// les champs de saisie du formulaire
const inputFields = ["Nom", "Prénom", "Email", "Mot du passe"];

const validFormPayload: Record<string, string> = {
  Nom: "omar",
  Prénom: "harroud",
  Email: "harroud.omar.dev@gmail.com",
  ["Mot du passe"]: "P@ssw0rd",
};

const unvalidFormPayload: Record<string, string> = {
  Nom: "omar",
  Prénom: "harroud",
  Email: "harroud.omar.dev@gmail",
  ["Mot du passe"]: "P@ssw0rd",
};

describe("Soumission du formulaire", () => {
  it("Cela devrait afficher le composant de formulaire avec tous les champs.", () => {
    render(<Form mode="Test" />);
    const form: HTMLFormElement = screen.getByTestId("form-test");

    expect(form).toBeInTheDocument();
    inputFields.forEach((e) => {
      expect(screen.getByLabelText(e)).toBeInTheDocument();
    });
  });

  it("La soumission du formulaire devrait réussir lorsque les données simulées sont valides.", async () => {
    render(<Form mode="Test" />);
    const form: HTMLFormElement = screen.getByTestId("form-test");

    expect(form).toBeInTheDocument();

    inputFields.forEach((e) => {
      fireEvent.change(screen.getByLabelText(e), {
        target: {
          value: validFormPayload[e],
        },
      });
    });

    await userEvent.click(screen.getByTestId("test-submit"), {});
    await waitFor(() => {
      expect(
        screen.getByText("Le formulaire a été soumis avec succès.")
      ).toBeInTheDocument();
    });
  });
  it("La soumission du formulaire devrait échouer lorsque les données simulées sont invalides.", async () => {
    render(<Form mode="Test" />);
    const form: HTMLFormElement = screen.getByTestId("form-test");

    expect(form).toBeInTheDocument();

    inputFields.forEach((e) => {
      fireEvent.change(screen.getByLabelText(e), {
        target: {
          value: unvalidFormPayload[e],
        },
      });
    });

    await userEvent.click(screen.getByTestId("test-submit"), {});
    await waitFor(() => {
      expect(screen.getByText("validation error")).toBeInTheDocument();
    });
  });
});
