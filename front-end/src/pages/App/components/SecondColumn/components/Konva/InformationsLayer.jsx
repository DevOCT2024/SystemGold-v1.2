import { Group, Image, Text } from "react-konva";
import React from "react";

export function InformationsLayer({
  handleSelect,
  informations,
  adress,
  logoWhats,
  logoTel,
}) {
  // 👇 garante que sempre teremos um array
  const list = Array.isArray(informations)
    ? informations
    : informations
    ? [informations]
    : [];

  return (
    <Group
      x={100}
      y={100}
      onClick={handleSelect}
      draggable
    >
      {list.map((info, index) => (
        // 👇 adiciona uma key estável para cada bloco
        <React.Fragment key={index}>
          {adress && (
            <Text
              type="adress"
              text={info.Adress || ""}
              fontSize={16}
              fill="black"
              x={0}
              y={index * 40}
              fontFamily="segoeui"
            />
          )}

          {adress && (
            <Image
              type="adress"
              image={info.Whatsapp ? logoWhats : null}
              width={15}
              height={15}
              x={240}
              y={index * 40}
            />
          )}

          {adress && (
            <Text
              type="adress"
              text={info.Whatsapp || ""}
              fontSize={16}
              fill="black"
              x={260}
              y={index * 40}
              fontFamily="Viga"
            />
          )}

          {adress && (
            <Image
              type="adress"
              image={info.Telefone ? logoTel : null}
              width={15}
              height={15}
              x={360}
              y={index * 40}
            />
          )}

          {adress && (
            <Text
              type="adress"
              text={info.Telefone || ""}
              fontSize={16}
              fill="black"
              x={380}
              y={index * 40}
              fontFamily="Viga"
            />
          )}

          {adress && (
            <Text
              type="adress"
              text={info.horaFuncionamento || ""}
              fontSize={10}
              fill="black"
              x={0}
              y={index === 0 ? 20 : index * 40 + 20}
              fontFamily="Viga"
            />
          )}
        </React.Fragment>
      ))}
    </Group>
  );
}
