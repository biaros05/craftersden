import request from 'supertest';
import * as chai from 'chai';
import { describe, it } from 'mocha';
const expect = chai.expect;
import  app  from '../api.mjs';
import sinon from 'sinon';
import mongoose from 'mongoose';

const singleBlock = {
  '_id': '1',
  'name': 'acacia_button',
  'cuboids': [
    {
      'from': [0.3125, 0.375, 0.375],
      'to': [0.6875, 0.625, 0.625],
      'faces': {
        'down': {
          'uv': [5, 6, 11, 10],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'up': {
          'uv': [5, 10, 11, 6],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'north': {
          'uv': [5, 12, 11, 16],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'south': {
          'uv': [5, 12, 11, 16],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'west': {
          'uv': [6, 12, 10, 16],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        },
        'east': {
          'uv': [6, 12, 10, 16],
          'texture': 'https://imageblobbed.blob.core.windows.net/assets/acacia_planks.png'
        }
      }
    }
  ],
  'inventoryTexture': 'minecraft_acacia_button.png'
};

const multipleBlocks = [
  {
    '_id': '1',
    'name': 'acacia_log',
    'inventoryTexture': 'minecraft_acacia_log.png'
  },
  {
    '_id': '2',
    'name': 'acacia_button',
    'inventoryTexture': 'minecraft_acacia_button.png'
  }
];

