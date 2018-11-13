// * ContentForm.tsx

// ** License

/**
 * Copyright (C) 2018, Bartłomiej Nankiewicz<bartlomiej.nankiewicz@gmail.com>
 *
 * This file is part of Organic.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// ** Imports

import React from 'react';
import { Field, reduxForm } from 'redux-form';
import OrgContentStyles from '../components/styles/OrgContentStyles';
import { Colors } from '../themes';
import { CaptureTextInput } from './CaptureTextInput';

// ** Shape

// ** Component

export const ContentForm = reduxForm({
  form: 'capture',
})(() => (
  <Field
    name="content"
    component={CaptureTextInput}
    placeholder="Enter node content..."
    style={OrgContentStyles.regularLine}
    multiline={true}
    underlineColorAndroid={Colors.bg}
  />
));
