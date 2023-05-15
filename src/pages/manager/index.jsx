import { ManagerLayout } from "./components/managerLayout";
import { ManagerContent } from "./components/managerContent";
export function Manager() {
  return <ManagerLayout>{<ManagerContent />}</ManagerLayout>;
}
