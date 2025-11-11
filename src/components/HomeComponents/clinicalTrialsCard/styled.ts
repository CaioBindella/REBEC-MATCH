"use client";
import styled from 'styled-components';

export const TrialsContainer = styled.section`
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

export const TrialCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

export const TrialTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin: 0 0 1rem 0;
  line-height: 1.4;
`;

export const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #6c757d;

  span {
    font-weight: 600;
    color: #495057;
    display: block;
  }
`;

export const OpenButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.4rem 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5a6268;
  }
`;

export const ViewAllLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;