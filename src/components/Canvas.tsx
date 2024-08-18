import { forwardRef } from 'react';
import './style.css';

export type Props = {
};

function Canvas(props: Props, ref) {
    return (
        <canvas 
            ref={ref}
            className="canvas"
        />
    );
}

export default forwardRef(Canvas);