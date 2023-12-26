import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import FullPageNotFoundView from '@components/BlockingViews/FullPageNotFoundView';
import Navigation from '@libs/Navigation/Navigation';
import * as ReportUtils from '@libs/ReportUtils';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

const propTypes = {
    /** Navigation route context info provided by react navigation */
    route: PropTypes.shape({
        /** Route specific parameters used on this screen */
        params: PropTypes.shape({
            /** The type of IOU report, i.e. bill, request, send */
            iouType: PropTypes.oneOf(_.values(CONST.IOU.TYPE)).isRequired,

            /** The type of IOU Request, i.e. manual, scan, distance */
            iouRequestType: PropTypes.oneOf(_.values(CONST.IOU.REQUEST_TYPE)).isRequired,
        }),
    }).isRequired,
};

function IOURequestRedirectToStartPage({
    route: {
        params: {iouType, iouRequestType},
    },
}) {
    // Dismiss this modal because the redirects below will open a new modal and there shouldn't be two modals stacked on top of each other.
    Navigation.dismissModal();

    // Redirect the person to the right start page using a rendom reportID
    const optimisticReportID = ReportUtils.generateReportID();
    if (iouRequestType === CONST.IOU.REQUEST_TYPE.DISTANCE) {
        Navigation.navigate(ROUTES.MONEY_REQUEST_CREATE_TAB_DISTANCE.getRoute(iouType, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
    } else if (iouRequestType === CONST.IOU.REQUEST_TYPE.MANUAL) {
        Navigation.navigate(ROUTES.MONEY_REQUEST_CREATE_TAB_MANUAL.getRoute(iouType, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
    } else if (iouRequestType === CONST.IOU.REQUEST_TYPE.SCAN) {
        Navigation.navigate(ROUTES.MONEY_REQUEST_CREATE_TAB_SCAN.getRoute(iouType, CONST.IOU.OPTIMISTIC_TRANSACTION_ID, optimisticReportID));
    }
    return <FullPageNotFoundView />;
}

IOURequestRedirectToStartPage.displayName = 'IOURequestRedirectToStartPage';
IOURequestRedirectToStartPage.propTypes = propTypes;

export default IOURequestRedirectToStartPage;
