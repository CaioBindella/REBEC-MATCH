"use client";
import Image from 'next/image';
import { ThemeProvider } from 'styled-components';
import * as fc from './styled';


type CardProps = {
  image?: string;
  color: string;
  title: string;
  text: string;
  buttonText: string;
  backgroundImage: string; 
};

export default function Card({ color, title, text, buttonText, image, backgroundImage }: CardProps) {
  
  // O tema permite que componentes filhos (como o botão) acessem a cor
  const theme = {
    mainColor: color,
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Removemos o style inline e passamos as props para o styled-component */}
      <fc.CardContainer color={color} backgroundImage={backgroundImage}>
        {image ? <Image src={image} alt="Card Icon" width={45} height={45} /> : null}

        <fc.Card>
          <fc.Title>{title}</fc.Title>
          <fc.Text>{text}</fc.Text>
          <fc.Button>{buttonText}</fc.Button>
        </fc.Card>
      </fc.CardContainer>
    </ThemeProvider>
  );
}