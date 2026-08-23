
export default function AlertBanner({title,message, type="warning"}){
  return(
    <div className={`alert-banner alert-${type}`} role="alert">
        <strong className="alert-title">{title}</strong>
        <p className="alert-message">{message}</p>

    </div>
  )



}