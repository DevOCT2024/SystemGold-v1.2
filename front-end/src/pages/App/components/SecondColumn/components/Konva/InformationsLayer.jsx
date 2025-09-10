import { Group, Image, Text } from "react-konva";

export function InformationsLayer({
    handleSelect,
    informations,
    adress,
    logoWhats,
    logoTel
 }) {

    return (
        <Group
            x={100} // Posição inicial do grupo no eixo X
            y={100} // Posição inicial do grupo no eixo Y
            onClick={handleSelect}
            draggable // Permite arrastar o grupo inteiro
        >
            {informations?.map((info, index) => (
                <>
                    {/* Endereço */}
                    {adress && (
                        <Text
                            type="adress"
                            key={`adress-${index}`}
                            text={info.Adress || ''}
                            fontSize={16}
                            fill="black"
                            x={0} // Mantém alinhado no eixo X
                            y={index * 40} // Ajusta a posição Y dinamicamente
                            fontFamily="segoeui"
                        />
                    )}

                    {/* Ícone WhatsApp */}
                    {adress && (
                        <Image
                            type="adress"
                            key={`whatsapp-icon-${index}`}
                            image={info.Whatsapp ? logoWhats : null}
                            width={15}
                            height={15}
                            x={240} // Ajusta ao lado do endereço
                            y={index * 40}
                        />
                    )}

                    {/* Telefone */}
                    {adress && (
                        <Text
                            type="adress"
                            key={`whatsapp-text-${index}`}
                            text={info.Whatsapp || ''}
                            fontSize={16}
                            fill="black"
                            x={260} // Ajusta ao lado do ícone WhatsApp
                            y={index * 40}
                            fontFamily="Viga"
                        />
                    )}

                    {/* Ícone Telefone */}

                    {adress && (

                        <Image
                            type="adress"
                            key={`telefone-icon-${index}`}
                            image={info.Telefone ? logoTel : null}
                            width={15}
                            height={15}
                            x={360} // Ajusta ao lado do telefone
                            y={index * 40}
                        />
                    )}

                    {adress && (
                        <Text
                            type="adress"
                            key={`telefone-${index}`}
                            text={info.Telefone || ''}
                            fontSize={16}
                            fill="black"
                            x={380} // Ajusta ao lado do ícone WhatsApp
                            y={index * 40}
                            fontFamily="Viga"
                        />

                    )}


                    {/* Horário de Funcionamento */}
                    {adress && (
                        <Text
                            type="adress"
                            key={`hora-${index}`}
                            text={info.horaFuncionamento || ''}
                            fontSize={10}
                            fill="black"
                            x={0} // Ajusta ao lado do último ícone
                            y={index === 0 ? 20 : index * 40 + 20}
                            fontFamily="Viga"
                        />
                    )}
                </>
            ))}
        </Group>
    )
}