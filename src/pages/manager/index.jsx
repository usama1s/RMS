import { ManagerLayout } from "./components/managerLayout";
import { ManagerContent } from "./components/managerContent";
import { CartModal } from "../../components/cartModal";
import { useCartCtx } from "../../context/CartCtx";
import { ManCart } from "../../components/manCart";

export function Manager() {
  const { cartModalStatus, cartStatus } = useCartCtx();

  return (
    <ManagerLayout>
      {<ManagerContent />}
      {cartModalStatus.open && <CartModal />}
      {cartStatus && <ManCart />}
    </ManagerLayout>
  );
}
