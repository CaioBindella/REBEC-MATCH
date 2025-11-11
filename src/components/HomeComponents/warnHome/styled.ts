"use client";
import styled from 'styled-components';

export const AvisosContainer = styled.section`
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem 2rem;
  font-family: sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 70%;
`;

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #343a40;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f3f5;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Paragraph = styled.p`
  font-size: 0.95rem;
  line-height: 1.7;
  color: #495057;
  margin: 0;
  white-space: pre-wrap;

  strong {
    font-weight: 600;
    color: #212529;
  }
`;

export const SubHeading = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #212529;
  margin: 1.5rem 0 0.5rem 0;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f3f5;
`;

export const List = styled.ol`
  padding-left: 1.5rem;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #495057;

  li {
    margin-bottom: 0.75rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;