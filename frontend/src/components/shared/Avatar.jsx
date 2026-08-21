export default function Avatar({name}){
  const initials = name
  .split(" ")
  .map((word) =>word[0])
  .join("")
  .toUpperCase()

  return(
    <span className="avatar" aria-hidden = "true">{initials}</span>
  )

}