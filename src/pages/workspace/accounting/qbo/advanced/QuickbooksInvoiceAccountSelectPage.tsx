import React, {useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import SelectionList from '@components/SelectionList';
import RadioListItem from '@components/SelectionList/RadioListItem';
import type {ListItem} from '@components/SelectionList/types';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import Navigation from '@libs/Navigation/Navigation';
import AdminPolicyAccessOrNotFoundWrapper from '@pages/workspace/AdminPolicyAccessOrNotFoundWrapper';
import FeatureEnabledAccessOrNotFoundWrapper from '@pages/workspace/FeatureEnabledAccessOrNotFoundWrapper';
import PaidPolicyAccessOrNotFoundWrapper from '@pages/workspace/PaidPolicyAccessOrNotFoundWrapper';
import withPolicy from '@pages/workspace/withPolicy';
import type {WithPolicyProps} from '@pages/workspace/withPolicy';
import CONST from '@src/CONST';

type SelectorType = ListItem & {
    value: string;
};

// TODO: remove once UI is approved
const DRAFT = [{name: 'Croissant Co Payroll Account'}, {name: 'Croissant Co Money in Clearing'}, {name: 'Croissant Co Debts and Loans'}];

function QuickbooksInvoiceAccountSelectPage({policy}: WithPolicyProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const {bankAccounts, creditCards} = policy?.connections?.quickbooksOnline?.data ?? {};
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const accountOptions = bankAccounts || creditCards || DRAFT;

    const [selectedAccount, setSelectedAccount] = useState('Croissant Co Money in Clearing');

    const policyID = policy?.id ?? '';

    const qboOnlineSelectorOptions = useMemo<SelectorType[] | undefined>(
        () =>
            accountOptions?.map(({name}) => ({
                value: name,
                text: name,
                keyForList: name,
                isSelected: selectedAccount === name,
            })),
        [selectedAccount, translate, accountOptions],
    );

    const listHeaderComponent = useMemo(
        () => (
            <View style={[styles.pb2, styles.ph5]}>
                <Text style={[styles.pb5, styles.textNormal]}>{translate('workspace.qbo.advancedConfig.invoiceAccountSelectDescription')}</Text>
            </View>
        ),
        [translate, styles.pb2, styles.ph5, styles.pb5, styles.textNormal],
    );

    const initiallyFocusedOptionKey = useMemo(() => qboOnlineSelectorOptions?.find((mode) => mode.isSelected)?.keyForList, [qboOnlineSelectorOptions]);

    const updateMode = useCallback((mode: SelectorType) => {
        // TODO add API call for change instead setting state
        setSelectedAccount(mode.value);
        Navigation.goBack();
    }, []);

    return (
        <AdminPolicyAccessOrNotFoundWrapper policyID={policyID}>
            <PaidPolicyAccessOrNotFoundWrapper policyID={policyID}>
                <FeatureEnabledAccessOrNotFoundWrapper
                    policyID={policyID}
                    featureName={CONST.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED}
                >
                    <ScreenWrapper
                        includeSafeAreaPaddingBottom={false}
                        testID={QuickbooksInvoiceAccountSelectPage.displayName}
                    >
                        <HeaderWithBackButton title={translate('workspace.qbo.advancedConfig.collectionAccount')} />

                        <SelectionList
                            sections={[{data: qboOnlineSelectorOptions ?? []}]}
                            ListItem={RadioListItem}
                            headerContent={listHeaderComponent}
                            onSelectRow={updateMode}
                            initiallyFocusedOptionKey={initiallyFocusedOptionKey}
                        />
                    </ScreenWrapper>
                </FeatureEnabledAccessOrNotFoundWrapper>
            </PaidPolicyAccessOrNotFoundWrapper>
        </AdminPolicyAccessOrNotFoundWrapper>
    );
}

QuickbooksInvoiceAccountSelectPage.displayName = 'QuickbooksInvoiceAccountSelectPage';

export default withPolicy(QuickbooksInvoiceAccountSelectPage);
