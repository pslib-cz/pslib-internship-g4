import styles from "./Address.module.css";

type AddressProps = {
  street: string | null;
  descNum: number | null;
  orientNum: string | null;
  municipality: string;
  country: string;
  postalCode: number | null;
};

export const Address: React.FC<AddressProps> = ({
  street,
  descNum,
  orientNum,
  municipality,
  postalCode,
  country,
}) => {
  return (
    <address className={styles.addressPanel}>
      {street}
      {street && descNum ? " " : null}
      {descNum}
      {descNum && orientNum ? "/" : ""}
      {orientNum}
      {", "}
      {postalCode} {municipality}
      {", "}
      {country}
    </address>
  );
};

export default Address;
