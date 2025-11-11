"use client";
import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 20px;
    width: 100%;
`;

export const Title = styled.h2`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 5px;
    color: #333;
`;

export const Input = styled.input`
    border: 1px solid grey;
    border-radius: 5px;
    padding: 10px;
    width: 100%;
    margin-bottom: 10px;
`;

export const LinkSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Link = styled.a`
    color: #007bff;
    padding: 0px;
    margin-left: 4px;
`;