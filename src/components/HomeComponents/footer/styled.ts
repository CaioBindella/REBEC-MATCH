"use client";
import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
  padding: 2rem;
  font-family: sans-serif;
  color: #333;
  width: 100%;
`;

export const Line = styled.div`
  height: 3.5rem;
  border-left: 1px solid #989898;
`;

export const TopSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: center; /* Alterado de space-between para center */
  align-items: center;      /* Alterado de flex-start para center */
  flex-wrap: wrap;
  gap: 2rem;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ced4da;
`;

export const LogoContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;

  img {
    max-width: 180px;
    height: auto;
  }
`;

export const ColumnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  min-width: 150px;
  margin-left: 1px solid black;
`;

export const ColumnTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
`;

export const StyledLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #495057;
  font-size: 0.9rem;

  span {
    text-decoration: underline;
  }

  &:hover {
    color: #000;
  }
`;

export const RegisterButton = styled.button`
  background-color: #868e96;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6c757d;
  }
`;

export const BottomSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    max-width: 100%;
    height: auto;
  }
`;