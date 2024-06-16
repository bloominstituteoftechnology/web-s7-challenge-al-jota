import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L',
};


const getInitialErrors = () => ({
  fullName: "",
  size: "",
  toppings: "",
});


// 👇 Here you will create your schema.
const schema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: Yup.string()
    .required("Size is required")
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect),
  toppings: Yup.array().of(Yup.string()),
});


// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

export default function Form() {
  const [formValue, setFormValue] = useState({
    fullName: "",
    size: "",
    toppings: [],
  });

  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState(getInitialErrors());
  const [enabled, setEnabled] = useState(false);
  const [failure, setFailure] = useState(null);

  useEffect(() => {
    schema
      .isValid(formValue)
      .then((valid) => setEnabled(valid))
      .catch(() => setEnabled(false));
  }, [formValue]);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;

    let newValue = type === "checkbox" ? checked : value;
    console.log(name);
    if (name === "fullName") {
      newValue = newValue.trim();
    }
    setFormValue((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    Yup.reach(schema, name)
      .validate(newValue)
      .then(() => {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      })
      .catch((err) => {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: err.errors[0] }));
      });
  };

  const onCheckboxChange = (event) => {
    const { value, checked } = event.target;
    let newToppings = [...formValue.toppings];

    if (checked) {
      newToppings = [...newToppings, value];
    } else {
      newToppings = newToppings.filter((topping) => topping !== value);
    }

    setFormValue({ ...formValue, toppings: newToppings });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:9009/api/order", {
        ...formValue,
        toppings: Array.from(formValue.toppings),
      })
      .then((res) => {
        setFormValue({ fullName: "", size: "", toppings: [] });
        setSuccess(res.data.message);
        setFailure(null);
        setEnabled(true);
      })
      .catch((err) => {
        setFailure(err.response.data.message);
        setSuccess("");
        setEnabled(false);
      });
  };

  return (
    <div>
      <h2>Order Your Pizza</h2>
      {success && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "green",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          {success}
        </div>
      )}
      {failure && (
        <div>
          <p>
            Thank you for your order, {formValue.fullName}! Your{" "} {formValue.size} pizza with {formValue.toppings.length} toppings is on the way.
          </p>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input
            placeholder="Type full name"
            onChange={onChange}
            id="fullName"
            name="fullName"
            type="text"
            value={formValue.fullName}
          />
        </div>
        {errors.fullName && (
          <div className="error">
            {formValue.fullName.length < 3
              ? validationErrors.fullNameTooShort
              : formValue.fullName.length > 20
              ? validationErrors.fullNameTooLong
              : ""}
          </div>
        )}

        <div className="input-group">
          <div>
            <label htmlFor="size">Size</label>
            <br />
            <select
              onChange={onChange}
              id="size"
              name="size"
              value={formValue.size}
            >
              <option value="">----Choose Size----</option>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
          </div>
          {errors.size && <div className="error">{errors.size}</div>}
        </div>

        <div className="input-group">

          {toppings.map((topping) => (
            <label key={topping.topping_id}>
              <input
                name="toppings"
                type="checkbox"
                value={topping.topping_id}
                checked={formValue.toppings.includes(topping.topping_id)}
                onChange={onCheckboxChange}
              />
              {topping.text}
              <br />
            </label>
          ))}
        </div>

        <input type="submit" disabled={!enabled} />

      </form>
    </div>
  );
}

//       {true && <div className='success'>Thank you for your order!</div>}
//       {true && <div className='failure'>Something went wrong</div>}

//       <div className="input-group">
//         <div>
//           <label htmlFor="fullName">Full Name</label><br />
//           <input placeholder="Type full name" id="fullName" type="text" minLength="3" maxLength="20"/>
//         </div>
//         {true && <div className='error'>Bad value</div>}
//       </div>

//       <div className="input-group">
//         <div>
//           <label htmlFor="size">Size</label><br />
//           <select id="size">
//             <option value="">----Choose Size----</option>
//             {/* Fill out the missing options */}
//             <option value="S">Small</option>
//             <option value="M">Medium</option>
//             <option value="L">Large</option>
//           </select>
//         </div>
//         {true && <div className='error'>Bad value</div>}
//       </div>

//       <div className="input-group">
//         {/* 👇 Maybe you could generate the checkboxes dynamically */}
//         {toppings.map((topping) => (
//           <label key={topping.topping_id}>
//             <input
//             name="toppings"
//             type="checkbox"
//             value={topping.topping_id}
//             checked={formValue.toppings.includes(topping.topping_id)}
//             onChange={onCheckboxChange}
//             />
//             {topping.text}
//             <br />
//           </label>
//         ))}
//         </div>

//         <label key="1">
//           <input
//             name="Pepperoni"
//             type="checkbox"
//           />
//           Pepperoni<br />
//         </label>
//         <label key="2">
//           <input
//             name="Green Peppers"
//             type="checkbox"
//           />
//           Green Peppers<br />
//         </label>
//         <label key="3">
//           <input
//             name="Pineapple"
//             type="checkbox"
//           />
//           Pineapple<br />
//         </label>
//         <label key="4">
//           <input
//             name="Mushrooms"
//             type="checkbox"
//           />
//           Mushrooms<br />
//         </label>
//         <label key="5">
//           <input
//             name="Ham"
//             type="checkbox"
//           />
//           Ham<br />
//         </label>
//       </div>
//       {/* 👇 Make sure the submit stays disabled until the form validates! */}
//       <input 
//       type="submit" 
//       disabled={!enabled}
//       />
//     </form>
//     </div>
//   )
// }
