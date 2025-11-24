import { useState } from "react";
import styles from './StarRating.module.css';

export default function StarRating({ value, onRate }) {
    const [hover, setHover] = useState(null);

    return (
        <div className={styles.container}>
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = hover ? star <= hover : star <= value;

                return (
                    <span
                        key={star}
                        className={filled ? styles.starFilled : styles.star}
                        onClick={() => onRate(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}
