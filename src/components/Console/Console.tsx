import { useConsole } from "../../context/Console";

import styles from './Console.module.css';

export default function Console() {
    const { console } = useConsole();
  return (
    <div className={styles.console}>{console.map((msg, index) => <div key={index}>{msg}</div>)}</div>
  )
}
