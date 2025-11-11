'use client';
import styled from 'styled-components';

export const FormContainer = styled.form`
  width: 65%;
  max-width: 70%;
  margin: 0 auto;
  padding: 2rem;
  background-color: #F8F9FA;
  border-radius: 12px;
  margin-top: 3%;
  margin-bottom: 3%;
`;

export const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
  color: #0D503C;
  border-bottom: 2px solid #107569;
  padding-bottom: 0.5rem;
  margin: 0.5rem 0 0.5rem 0;
`;

export const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-start;
  
  & > ${'${InputGroup}'} { 
    flex-grow: 1;
    flex-shrink: 1;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%; 
  flex-grow: 1; 
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #343a40;
`;

export const Input = styled.input`
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #fff;
  width: 100%;

  &::placeholder {
    color: #adb5bd;
  }
`;

export const Select = styled.select`
  font-size: 1rem;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  width: 100%;
  background-color: #fff;
`;

export const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #dc3545;
  margin: 0;
`;

export const AddButton = styled.button`
  background-color: transparent;
  color: #007bff;
  border: none;
  padding: 0.25rem 0;
  cursor: pointer;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 600;
  align-self: flex-start;

  &:hover {
    text-decoration: underline;
  }
`;

export const RemoveButton = styled.button`
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  
  &:hover {
    background-color: #f1b0b7;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  border-top: 1px solid #e9ecef;
  padding-top: 2rem;
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  background-color: ${({ $variant }) => $variant === 'secondary' ? '#6c757d' : '#107569'};
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const RepetibleSection = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #fdfdfd;
`;


export const SubSectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
  margin-top: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
`;

export const CheckboxGrid = styled.div`
  column-count: 3;
  column-gap: 1.5rem;

  @media (max-width: 992px) {
    column-count: 2;
  }

  @media (max-width: 768px) {
    column-count: 1;
  }
`;

export const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  break-inside: avoid;
  padding-bottom: 1rem;
`;

export const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  width: 1rem;
  height: 1rem;
  accent-color: #107569;
`;

export const CheckboxLabel = styled.label`
  font-size: 0.95rem;
  color: #495057;
`;