import { Stepper, Step, StepLabel } from "@mui/material";

export default function CheckoutSteps({
  step1,
  step2,
  step3,
  step4,
}: {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}) {
  const steps = ["Belépés", "Szállítás", "Fizetés", "Rendelés Leadása"];

  const activeStep = step1 ? 0 : step2 ? 1 : step3 ? 2 : step4 ? 3 : -1;

  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
