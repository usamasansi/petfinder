import { FieldErrors } from "react-hook-form";

export const isErrorsObjectEmpty = (errorsObject: FieldErrors<FormData>) =>
  Object.keys(errorsObject).length === 0;
