import "./Separator.css";

export default function Separator({ thickness = "3px" }) {
  return <div className="separator" style={{ height: thickness }}></div>;
}
