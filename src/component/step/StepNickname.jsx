// 최초 앱 접속자 온보딩(로그인 기능이 없으므로 생략, 추후 구현 에정)
// 링크로 접속한 사용자의 온보딩
// 닉네임 localStorage에 저장
import React from "react";
import styled from "styled-components";

function StepNickname({ nickname, setNickname }) {
  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    if (newNickname.length <= 10) {
      // 10자 제한
      setNickname(newNickname);
    }
  };

  return (
    <Wrapper>
      <Container>
        <TextBlock>
          <Title>닉네임을 입력해주세요</Title>
          <Detail>나만의 지도에 표시될 닉네임을 입력해주세요.</Detail>
        </TextBlock>

        <InputContainer>
          <NicknameInput
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임 입력 (2-10자)"
            maxLength={10}
          />
          <CharCount>{nickname.length}/10</CharCount>
        </InputContainer>
      </Container>
    </Wrapper>
  );
}

export default StepNickname;

// styled-components
const Wrapper = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  align-items: stretch;
  gap: 54px;
`;

const Container = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 32px;
  height: 100%;
  justify-content: flex-start;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const Title = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.2px;
  color: #000000;
`;

const Detail = styled.div`
  font-family: "Pretendard", sans-serif;
  color: #585858;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  margin: 0;
  padding-left: 5px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const NicknameInput = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  background-color: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ff7e74;
  }

  &::placeholder {
    color: #bababa;
  }
`;

const CharCount = styled.div`
  position: absolute;
  right: 0;
  top: -26px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #bababa;
  text-align: center;
`;
