import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'headerFilter'
})
export class FilterHeadersPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    return items.filter(it => {
      return it.WCR_Description.toString().toLocaleLowerCase().includes(searchText);
    });
  }
}