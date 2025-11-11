'use client';

import styled from 'styled-components';

export const PageContainer = styled.main`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #ffffff;
  padding: 4rem 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #343a40;
  text-align: center;
  margin-bottom: 0.75rem;
`;

export const HeaderSeparator = styled.hr`
  width: 80%;
  max-width: 600px;
  border: none;
  height: 1px;
  background-color: #dee2e6;
  margin-bottom: 3rem;
`;

export const Subtitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #495057;
  margin-bottom: 1.5rem;
`;

export const InstructionsBox = styled.div`
  background-color: #fffbeb;
  border: 1px solid #ffe8a8;
  border-radius: 8px;
  padding: 2.5rem;
  width: 100%;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const InstructionsList = styled.ul`
  list-style-type: disc;
  list-style-position: inside;
  padding-left: 0;
  margin: 0;
`;

export const ListItem = styled.li`
  color: #594d2c;
  font-size: 1rem;
  line-height: 1.6;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const NextButton = styled.button`
  background-color: #107569;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
    box-shadow: 0 4px 15px rgba(16, 117, 105, 0.3);
    transform: translateY(-2px);
  }
`;