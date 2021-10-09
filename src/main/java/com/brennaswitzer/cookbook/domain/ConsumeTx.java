package com.brennaswitzer.cookbook.domain;

import lombok.NoArgsConstructor;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("2")
@NoArgsConstructor
public class ConsumeTx extends InventoryTx {

    public ConsumeTx(
            CompoundQuantity quantity
    ) {
        super(quantity);
    }

    public CompoundQuantity computeNewQuantity(CompoundQuantity curr) {
        return curr.minus(getQuantity());
    }

}