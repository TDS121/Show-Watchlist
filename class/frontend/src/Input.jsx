// From lab 9 - Input.jsx
// One text box. Props say what kind of box it is and what's typed in it.
// autoComplete lets the browser offer to save and fill in the password.
function Input(props) {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      aria-label={props.placeholder}
      autoComplete={props.autoComplete}
      value={props.value}
      onChange={props.onChange}
    />
  );
}

export default Input;
