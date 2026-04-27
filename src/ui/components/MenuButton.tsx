import { Container, Text } from "@react-three/uikit";

export default function MenuButton({onClick, children}: {onClick: any; children: React.ReactNode}) {

    return (
        <Container
            borderColor='white'
            borderWidth={2}
            padding={10}
            cursor='pointer'
            hover={{ backgroundColor: "white", color: "black" }}
            minWidth={150}
            onClick={onClick}
            alignContent={"center"}
            justifyContent={"center"}
            pointerEvents='auto'
        >
        <Text
                fontSize={16}
                color='white'
                textAlign='center'
              >
                {children}
              </Text>
            </Container>
    )
}