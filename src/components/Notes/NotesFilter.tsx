import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Form, Button, FormControl, Pagination } from 'react-bootstrap';
import styled from 'styled-components';
import { queryType, queryToParams } from './index';

type Props = {
  isMyNotes: boolean;
  query: queryType;
  maxPage: number;
};

const NotesFilter: React.FC<Props> = props => {
  const { isMyNotes, query,  maxPage } = props;
  const [filterQuery, setFilterQuery] = useState(query);

  const page = query.page;
  let pages: number[] = [];

  useEffect(() => {
    setFilterQuery(Object.assign({}, props.query));
  }, [props])

  if (maxPage <= 10) {
    for (let i = 1; i <= maxPage; i++) pages.push(i);
  } else {
    if (page !== 1 && page !== maxPage) pages.push(query.page);

    let cur = page - 1;
    let p = 1;
    while (cur > 1) {
      pages.push(cur);
      cur -= Math.pow(2, p);
      p *= 2;
    }
    pages.push(1);

    pages = pages.reverse();

    cur = page + 1;
    p = 1;
    while (cur < maxPage) {
      pages.push(cur);
      cur += Math.pow(2, p);
      p *= 2;
    }
    pages.push(maxPage);
  }

  const onChangeService = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterQuery({...filterQuery, domain: e.target.value})
  }

  const onChangeProblemNo = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    let problemNo = parseInt(e.currentTarget.value);
    if (isNaN(problemNo)) {
      problemNo = 0;
    }
    setFilterQuery({...filterQuery, problemNo})
  }

  const onChangeUserName= (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    setFilterQuery({...filterQuery, userName: e.currentTarget.value})
  }

  const onChangeTag= (e: React.FormEvent<FormControl & HTMLInputElement>) => {
    setFilterQuery({...filterQuery, tag: e.currentTarget.value})
  }

  const resetFilter = () => {
    setFilterQuery({
      domain: "",
      problemNo: 0,
      userName: "",
      tag: "",
      page: 1,
      order: ""
    });
  }

  return (
    <Container>
      <FilterContainer>
        <div style={{width: "15%", minWidth: "80px"}}>
          <Form.Control as="select" onChange={onChangeService} value={filterQuery.domain}>
            <option value="" disabled style={{display: "none"}}>Service</option>
            <option value="" >-</option>
            <option value="atcoder">AtCoder</option>
            <option value="codeforces">Codeforces</option>
            <option value="yukicoder">yukicoder</option>
            <option value="aoj">AOJ</option>
            <option value="leetcode">LeetCode</option>
          </Form.Control>
        </div>
        {!isMyNotes &&
          <div style={{width: "18%", minWidth: "80px"}}>
            <Form.Control
              placeholder="User"
              onChange={onChangeUserName}
              value={filterQuery.userName} />
          </div>}
        {!isMyNotes &&
          <div style={{width: "15%", minWidth: "80px"}}>
            <Form.Control
              placeholder="ProblemNo"
              onChange={onChangeProblemNo}
              value={filterQuery.problemNo !== 0 ? filterQuery.problemNo.toString() : ""} />
          </div>}
        <div style={{width: "22%", minWidth: "80px"}}>
          <Form.Control
            placeholder="Tag"
            onChange={onChangeTag}
            value={filterQuery.tag} />
        </div>
        <div style={{padding: "2px 0"}}>
          <LinkContainer
            to={isMyNotes ? `/mynotes` : `/notes`}>
            <Button
              variant="outline-light"
              type="button"
              onClick={resetFilter}>
              Reset
            </Button>
          </LinkContainer>
        </div>
        <div style={{padding: "2px 0"}}>
          <LinkContainer
            to={isMyNotes ? `/mynotes?${queryToParams(filterQuery)}` : `/notes?${queryToParams(filterQuery)}`}>
            <Button
              variant="primary"
              type="button">
              Filter
            </Button>
          </LinkContainer>
        </div>
      </FilterContainer>
      <PaginationContainer>
        <Pagination style={{justifyContent: "center"}}>
          {pages.map((v, k) => {
            const params = queryToParams({...filterQuery, page: v})
            return (
              <LinkContainer
                key={v}
                to={isMyNotes ? `/mynotes?${params}` : `/notes?${params}`}>
                <Pagination.Item active={v === query.page}>
                  {v}
                </Pagination.Item>
              </LinkContainer>
            )})}
        </Pagination>
      </PaginationContainer>
    </Container>
  );
}

const Container = styled.div`
  display: block;
  word-wrap: break-word;
`;

const FilterContainer = styled.div`
  display: inline-block;
  width: 100%;
  padding: 8px 8px 14px;

  & > div {
    display: inline-block;
    margin-right: 4px;
  }
`;

const PaginationContainer = styled.div`
  display: block;
  width: 100%;
`;

export default NotesFilter;