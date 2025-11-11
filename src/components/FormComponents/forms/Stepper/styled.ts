import styled from 'styled-components';

export const StepperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 3rem;
`;

export const Step = styled.div<{ $isActive: boolean }>`
  padding: 1rem 0.5rem;
  position: relative;
  color: ${({ $isActive }) => $isActive ? '#107569' : '#adb5bd'};
  font-weight: ${({ $isActive }) => $isActive ? '600' : '500'};
  transition: color 0.3s;

  &::after {
    content: '';
    display: ${({ $isActive }) => $isActive ? 'block' : 'none'};
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #107569;
  }
`;

export const StepLabel = styled.span``;