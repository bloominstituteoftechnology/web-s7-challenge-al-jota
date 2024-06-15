import React, { useEffect, useState } from 'react'
import * as yup from 'yup';

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
  fullName: yup
  .string()
  .trim()
  .required()
  .min(3, validationErrors.fullNameTooShort)
  .max(20, validationErrors.fullNameTooLong),
  size: yup
  .string()
  .required(validationErrors.sizeIncorrect),
})

export default formSchema

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
  const [errors, setErrors] = useState(validationErrors)
  return (
    <form>
      <h2>Order Your Pizza</h2>
      {true && <div className='success'>Thank you for your order!</div>}
      {true && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" minLength="3" maxLength="20"/>
        </div>
        {true && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size">
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {true && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        <label key="1">
          <input
            name="Pepperoni"
            type="checkbox"
          />
          Pepperoni<br />
        </label>
        <label key="2">
          <input
            name="Green Peppers"
            type="checkbox"
          />
          Green Peppers<br />
        </label>
        <label key="3">
          <input
            name="Pineapple"
            type="checkbox"
          />
          Pineapple<br />
        </label>
        <label key="4">
          <input
            name="Mushrooms"
            type="checkbox"
          />
          Mushrooms<br />
        </label>
        <label key="5">
          <input
            name="Ham"
            type="checkbox"
          />
          Ham<br />
        </label>
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input 
      type="submit" 
      disabled={!isValid()}
      />
    </form>
  )
}
