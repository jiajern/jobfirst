import React from "react"
import { Button, Tabs } from 'antd';
import BusinessPicture from '../components/business_profile/businessPicture';
import Timeline from '../components/business_profile/Timeline';
import EditProfileForm from '../components/business_profile/EditProfileForm';
import PostJob from '../components/business_profile/postJob';
import About from '../components/business_profile/aboutCompany';
import CeoPic from '../components/business_profile/ceoPic'
import BriefInfo from "../components/business_profile/briefInfo";
import CompanyVideo from "../components/business_profile/video";
import * as queries from '../graphql/queries';
import { API, graphqlOperation, Auth, I18n } from "aws-amplify";
import '../style/businessProfile.css';



const TabPane = Tabs.TabPane;

let bodyStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto',
  width: '90%',
  position: "relative",
  top: "-20px",
  backgroundColor: "white"

}

class businessProfile extends React.Component {
  state = {
    visible: false,
    jobList: [],
    companyID: "",
    companyName: "",
    companyWebsite: "",
    companyType: "",
    headquarter: "",
    companyAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: ""
    },
    ceoPic: "",
    ceo: "",
    size: "",
    revenue: "",
    timeline: [{ info: "3" }],
    jobAmount: 0,
    description: "",
    companyPic: "",
    value: 0
  }

  //Download businessProfile data from AWS
  componentWillMount = async () => {

    //set up companyID
    let user = await Auth.currentAuthenticatedUser();
    const { attributes } = user;
    let employerData = await API.graphql(graphqlOperation(queries.getEmployer, { id: attributes.sub }));
    this.setState({ companyID: attributes.sub });
    console.log("this is employerdata: " + employerData);

    //set up other employer info
    employerData = employerData.data.getEmployer;
    for (let item in employerData) {
      if (employerData[item] && item != "timeline" && item != "companyAddress" && item != "job" && item != "id") {
        this.setState({ [item]: employerData[item] });
      }
    }

    //set up other employer info with nested object
    this.setState({ timeline: employerData.timeline.items });
    this.setState({ jobList: employerData.job.items });
    this.setState({ jobAmount: employerData.job.items.length })

    //set up the address data
    if (employerData.companyAddress) {
      let addressLine1 = employerData.companyAddress.line1;
      let addressLine2 = employerData.companyAddress.line2;
      let city = employerData.companyAddress.city;
      let postalCode = employerData.companyAddress.postalCode;
      let state = employerData.companyAddress.state;
      let id = employerData.companyAddress.id;
      let companyAddress = {
        id,
        addressLine1,
        addressLine2,
        city,
        postalCode,
        state
      }
      this.setState({ companyAddress });
    }

    console.log("employer", employerData);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {

    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <div >
        <div className="banner">
        </div>
        <div style={bodyStyle}>
          <div className="secBanner">
            <BusinessPicture companyPic={this.state.companyPic} />
            <div className="companyHeader">
              <h1 style={{ fontSize: "4em" }}>{this.state.companyName}</h1>
              <h2 className="companyLocation">{this.state.companyAddress.city}</h2>
            </div>
            <Button className="editButton" type="primary" onClick={this.showModal}>
                {I18n.get('Edit Profile')}
              </Button>
          </div>

          <div style={{ padding: "0px 60px" }}>
            <Tabs defaultActiveKey="1" >
              <TabPane tab={I18n.get('Profile')} key="1" >
                <div>
                  <div >
                    <EditProfileForm
                      data={this.state}
                      visible={this.state.visible}
                      onOk={this.handleOk}
                      onCancel={this.handleCancel}
                    />
                  </div>
                  <div className="row1">
                    <div style={{ width: "65%" }}>
                      <About
                        description={this.state.description}
                      />
                    </div>
                    <BriefInfo
                      companyWebsite={this.state.companyWebsite}
                      size={this.state.size}
                      revenue={this.state.revenue}
                      jobAmount={this.state.jobAmount}
                      companyType={this.state.companyType}
                      headquarter={this.state.headquarter}
                    />
                  </div>
                  <div className="row2">
                    <Timeline timeline={this.state.timeline} />
                    <div style={{ width: "50%" }}>
                      <CeoPic
                        ceo={this.state.ceo}
                        ceoPic={this.state.ceoPic}
                      />
                      <CompanyVideo />
    
                    </div>

                  </div>
                </div>

              </TabPane>
              <TabPane tab={I18n.get('Jobs') + "(" + this.state.jobAmount + ")"} key="2">
                <div>
                  <PostJob
                    jobList={this.state.jobList}
                    companyPic={this.state.companyPic} />
                </div>
              </TabPane>
            </Tabs>
          </div>

        </div>
      </div>
    );
  }
}


export default businessProfile;
