import * as Yup from "yup";
// export const validation_schema_form = Yup.object({
//   email: Yup.string()
//     .email("Please provide a valid email address")
//     .required("Email is required"),
//   password: Yup.string().required("Password is required."),
// });

export const validation_schema_form = Yup.object({
  email: Yup.string()
    .matches(
      /^(?:[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[a-zA-Z0-9._]+)$/,
      "Invalid email or username"
    )
    .required("Email or username is required"),
  password: Yup.string().required("Password is required."),
});

export const validation_schema_form_b = Yup.object({
  email: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required."),
});

export const validation_schema_food_items = Yup.object({
  title: Yup.string().required("Title is required."),
  description: Yup.string().required("Description is required."),
  price: Yup.number("Price is required and must be a positive number.")
    .required("Price is required and must be a positive number.")
    .positive("Price is required and must be a positive number."),
  category: Yup.string().required("Select a category"),
});
export const validation_schema_food_categories = Yup.object({
  title: Yup.string().required("Title is required."),
});
export const validation_schema_lobbies = Yup.object({
  title: Yup.string().required("Title is required"),
  noOfTables: Yup.number("Number of tables is required.")
    .required("Number of tables is required.")
    .positive("Number of table must be a positive number."),
});

export const validation_schema_takeaway = Yup.object({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  phoneNo: Yup.string().required("Phone number is required.s"),
});
export const validation_schema_dinein = Yup.object({
  name: Yup.string().required("Name is required"),
  lobby: Yup.string().required("Lobby is required"),
  tableNo: Yup.string("Table number is required.").required(
    "Table number is required."
  ),
});
export const validation_schema_admin_add_managers = Yup.object({
  branchName: Yup.string().required("Branch Name is required"),
  managerName: Yup.string().required("Manager Name is required"),
  email: Yup.string().email("Email is required").required("Email is required"),
  password: Yup.string().required("Password is required"),
});
export const validation_schema_manager_add_waiters = Yup.object({
  waiterName: Yup.string().required("Waiter Name is required"),
  subRole: Yup.string().required("Role is required"),
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});
