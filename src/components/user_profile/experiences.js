import React from 'react';
import { Card, Icon, Button } from 'antd';
import { getUser } from '../../services/auth';
import { I18n } from 'aws-amplify';
import dict from "../dictionary/dictionary"

const Experiences = (props) => {

    //const renderButton = props.allowEdit ? <Button type="danger" onClick="">Delete</Button> : null;

    let experiencesList = [...props.experiences];
    let display = experiencesList.map(item =>
        <div align="center">
            <Card
                size="default"
                title={item.companyName}
                extra={props.allowEdit ? <Button type="danger" onClick={props.deleteExp.bind(null, item.id)}>Delete</Button> : null}
                style={{ width: "80%" }}
                key={item.id}
            >
                <p className="description" align="left" style={{ fontSize: 18 }}><Icon type="home" /><b> {I18n.get('Location')}: </b>{item.city}, {item.country}</p>
                <p className="description" align="left" style={{ fontSize: 18 }}><Icon type="clock-circle" /><b> {I18n.get('Years')}: </b>{item.startYear} to {item.endYear}</p>
                <p className="description" align="left" style={{ fontSize: 18 }}><Icon type="user-delete" /><b> {I18n.get('Reason for Leaving')}: </b>{item.reasonToLeave}</p>
            </Card>
            <br />
        </div>
    )

    return display;
}

export default Experiences;