"use client";
import styled from 'styled-components';

export const NewsContainer = styled.section`
  font-family: sans-serif;
  width: 100%;
`;

export const MainTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #343a40;
  margin-top: 0;
  margin-bottom: 1.5rem;
`;

export const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const NewsHeadline = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 1rem 0;
`;

export const NewsParagraph = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: #495057;
  margin: 0 0 1.5rem 0;
`;

export const ReadMoreButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5a6268;
  }
`;