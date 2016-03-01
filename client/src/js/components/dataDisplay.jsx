import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import ReactDom from 'react-dom';
import classNames from 'classnames/bind';
import styles from './D3.css';

export default class DataDisplay{
	getInitialState(){
		return {secNum:00000,co:0,cc:0,ch:0,cl:0,cv:0,ct:'0000-00-00 00:00:00'}
	}
	render(){
		<table border="0">
		  <tr>
		  	<th><input type="checkbox"></th>
		  	<th>Candle</th>
		    <th>Monthy </th>
		    <th>Savings</th>
		  </tr>
		  <tr>
		    <td>January</td>
		    <td>$100</td>
		  </tr>
		</table>
	}
}
