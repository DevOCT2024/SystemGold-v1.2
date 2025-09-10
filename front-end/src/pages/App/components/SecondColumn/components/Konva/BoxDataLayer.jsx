import { Image } from 'react-konva';

// const num = (v, fb = 0) => {
//     const x = typeof v === 'string' ? parseFloat(v) : v;
//     return Number.isFinite(x) ? x : fb;
// };

export function BoxDataLayer({ box, handleSelect, shapesRefs }) {
    return (
        <Image
            id={box.id}          // precisa existir pra bater com selectedShape.id()
            type="box"           // checar no delete
            image={box.image}
            x={box.x}
            y={box.y}
            width={box.width}
            height={box.height}
            draggable
            ref={(node) => (shapesRefs.current[box.id] = node)}
            onClick={(e) => handleSelect(e, box)}
            onTap={(e) => handleSelect(e, box)}

            // se por qualquer motivo o node virar NaN durante o drag, corrige na hora
            // onDragMove={(e) => {
            //     const node = e.target;
            //     const nx = num(node.x(), 0);
            //     const ny = num(node.y(), 0);
            //     if (!Number.isFinite(node.x()) || !Number.isFinite(node.y())) {
            //         node.position({ x: nx, y: ny });
            //         node.getLayer()?.batchDraw();
            //     }
            // }}

            // //só se já persiste posição no estado aqui:
            // onDragEnd={(e) => {
            //     const node = e.target;
            //     const nx = num(node.x(), 0);
            //     const ny = num(node.y(), 0);
            //     // chame  setter aqui se quiser salvar no estado
            // }}
        />
    );
}
